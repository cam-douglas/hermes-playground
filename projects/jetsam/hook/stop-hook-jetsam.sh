#!/usr/bin/env bash
# Jetsam diagnostic fixture — NOT ~/.claude/stop-hook-git-check.sh
# Encodes shipped vs naive vs suggested comparison from anthropics/claude-code#92338.
# Reads a named scenario (or "matrix") and prints exit codes from fixture fields.
# No live git remote. No secrets. Not an exploit. Documentation only.
#
# Usage:
#   bash hook/stop-hook-jetsam.sh matrix
#   bash hook/stop-hook-jetsam.sh adrift
#   bash hook/stop-hook-jetsam.sh pruned
#
# SHIPPED:  git rev-parse "origin/$current_branch" — local-ref existence, not remote existence
# NAIVE:    substitute default branch as upstream (WRONG for a fully pushed feature branch)
# SUGGESTED: containment check against default_ref BEFORE the unpushed= line

set -u

scenario="${1:-matrix}"

# Fixture table encoded from the issue's five scenarios plus idle/seeded pins.
# Fields: tracking_local tracking_remote ahead_tracking ahead_default contained has_work origin_head_unset
# "pass" in the issue matrix means the hook behaved correctly for that case,
# not that it always exited 0.

score_shipped() {
  local tracking_local="$1" ahead_tracking="$2" has_work="$3" origin_head_unset="$4"
  if [[ "$tracking_local" == "1" ]]; then
    if [[ "$ahead_tracking" -gt 0 ]]; then
      echo 2
    else
      echo 0
    fi
    return
  fi
  # Cite-only cousin path: origin/HEAD unset + never-pushed can swallow via || unpushed=0
  if [[ "$origin_head_unset" == "1" ]]; then
    echo 0
    return
  fi
  if [[ "$has_work" == "1" ]]; then
    echo 2
  else
    echo 0
  fi
}

score_naive() {
  local ahead_default="$1"
  if [[ "$ahead_default" -gt 0 ]]; then
    echo 2
  else
    echo 0
  fi
}

score_suggested() {
  local contained="$1"
  shift
  if [[ "$contained" == "1" ]]; then
    echo 0
    return
  fi
  score_shipped "$@"
}

expected_exit() {
  local contained="$1" tracking_local="$2" ahead_tracking="$3" has_work="$4"
  if [[ "$contained" == "1" ]]; then
    echo 0
    return
  fi
  if [[ "$tracking_local" == "1" && "$ahead_tracking" -gt 0 ]]; then
    echo 2
    return
  fi
  if [[ "$tracking_local" == "0" && "$has_work" == "1" ]]; then
    echo 2
    return
  fi
  echo 0
}

mark() {
  local got="$1" want="$2"
  if [[ "$got" == "$want" ]]; then
    echo pass
  else
    echo FAIL
  fi
}

run_row() {
  local name="$1"
  local tracking_local="$2"
  local tracking_remote="$3"
  local ahead_tracking="$4"
  local ahead_default="$5"
  local contained="$6"
  local has_work="$7"
  local origin_head_unset="$8"

  local shipped naive suggested want
  shipped="$(score_shipped "$tracking_local" "$ahead_tracking" "$has_work" "$origin_head_unset")"
  naive="$(score_naive "$ahead_default")"
  suggested="$(score_suggested "$contained" "$tracking_local" "$ahead_tracking" "$has_work" "$origin_head_unset")"
  want="$(expected_exit "$contained" "$tracking_local" "$ahead_tracking" "$has_work")"

  printf '%-48s  shipped=%s (%s)  naive=%s (%s)  suggested=%s (%s)\n' \
    "$name" \
    "$shipped" "$(mark "$shipped" "$want")" \
    "$naive" "$(mark "$naive" "$want")" \
    "$suggested" "$(mark "$suggested" "$want")"
}

echo "Jetsam diagnostic fixture — anthropics/claude-code#92338"
echo "SHIPPED  = rev-parse origin/\$branch (local tracking-ref existence)"
echo "NAIVE    = substitute origin/main as upstream (wrong)"
echo "SUGGESTED = merge-base --is-ancestor HEAD \$default_ref before unpushed="
echo

case "$scenario" in
  matrix)
    # 1 squash-merged, stale ref, nothing to push
    run_row "1 squash-merged, stale ref, nothing to push" 1 0 1 0 1 0 0
    # 2 genuinely unpushed commit on a tracked branch
    run_row "2 genuinely unpushed commit on tracked branch" 1 1 1 1 0 1 0
    # 3 fully pushed feature branch, 2 ahead of main
    run_row "3 fully pushed feature branch, 2 ahead of main" 1 1 0 2 0 0 0
    # 4 never-pushed branch with work (origin/HEAD set — issue matrix)
    run_row "4 never-pushed branch with work" 0 0 0 1 0 1 0
    # 5 on the default branch, in sync
    run_row "5 on the default branch, in sync" 1 1 0 0 1 0 0
    echo
    echo "Issue matrix expects: FAIL/pass/pass · pass/pass/pass · pass/FAIL/pass · pass/pass/pass · pass/pass/pass"
    ;;
  adrift|1|seed)
    run_row "adrift / #92338 squash-merged stale ref" 1 0 1 0 1 0 0
    echo "seeded word: adrift · shipped exit 2 · phantom unpushed"
    ;;
  pruned|idle)
    # tracking-ref pruned; HEAD contained in default
    run_row "pruned / idle hold after fetch --prune" 0 0 0 0 1 0 0
    echo "idle word: pruned · shipped exit 0"
    ;;
  naive-sub|3)
    run_row "fully pushed feature, 2 ahead of main (naive FAIL)" 1 1 0 2 0 0 0
    ;;
  *)
    echo "unknown scenario: $scenario" >&2
    echo "use: matrix | adrift | pruned | naive-sub" >&2
    exit 1
    ;;
esac
