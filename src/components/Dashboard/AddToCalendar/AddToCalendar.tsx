// "Add to calendar" for a ride: a small menu with Apple Calendar or Outlook
// (the .ics download) and Google Calendar. Built on <details>, so it works
// without any script.

import Calendar from "@/components/shared/icons/Calendar/Calendar";
import { googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";
import styles from "./AddToCalendar.module.css";

type Props = {
  bookingId: string;
  event: CalendarEvent;
};

export default function AddToCalendar({ bookingId, event }: Props) {
  return (
    <details className={styles.menu}>
      <summary className={styles.button}>
        <Calendar className={styles.icon} aria-hidden='true' />
        Add to calendar
      </summary>
      <div className={styles.panel}>
        <a
          href={`/dashboard/trips/${bookingId}/calendar`}
          className={styles.option}
          download
        >
          Apple Calendar or Outlook
        </a>
        <a
          href={googleCalendarUrl(event)}
          className={styles.option}
          target='_blank'
          rel='noopener noreferrer'
        >
          Google Calendar
        </a>
      </div>
    </details>
  );
}
