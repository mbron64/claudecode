#!/usr/bin/env bash
# Best-effort desktop notification, used by the Notification hook so you know
# when a Claude needs your input (Boris runs many in parallel and relies on this).
# No-ops cleanly on platforms/headless boxes without a notifier.
msg="${1:-Claude Code needs your attention}"

if command -v terminal-notifier >/dev/null 2>&1; then
  terminal-notifier -title "Claude Code" -message "$msg" >/dev/null 2>&1
elif command -v osascript >/dev/null 2>&1; then
  osascript -e "display notification \"$msg\" with title \"Claude Code\"" >/dev/null 2>&1
elif command -v notify-send >/dev/null 2>&1; then
  notify-send "Claude Code" "$msg" >/dev/null 2>&1
else
  printf '\a' # terminal bell fallback
fi
exit 0
