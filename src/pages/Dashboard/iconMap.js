// Maps icon names stored in JSON data files to actual lucide-react components,
// since JSON can't hold a component reference directly.
import {
  Users, BedDouble, CalendarCheck, FlaskConical, UserPlus, ClipboardCheck,
  FolderOpen, Settings, UserRound, FileText, Wrench, Headset,
} from "lucide-react";

export const ICON_MAP = {
  Users, BedDouble, CalendarCheck, FlaskConical, UserPlus, ClipboardCheck,
  FolderOpen, Settings, UserRound, FileText, Wrench, Headset,
};

export function resolveIcon(name) {
  return ICON_MAP[name] || Users;
}
