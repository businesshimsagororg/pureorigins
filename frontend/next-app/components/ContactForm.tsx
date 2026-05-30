"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { contact } from "@/lib/content";

export function ContactForm() {
  const [message, setMessage] = useState("");

  return (
    <form
      className="panel form-grid"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(contact.formSuccess);
      }}
    >
      <label htmlFor="contact-name">
        নাম
        <input id="contact-name" name="name" placeholder="আপনার নাম" required />
      </label>
      <label htmlFor="contact-phone">
        মোবাইল
        <input
          id="contact-phone"
          name="phone"
          placeholder="01XXXXXXXXX"
          maxLength={11}
          required
        />
      </label>
      <label htmlFor="contact-subject" className="full">
        বিষয়
        <input id="contact-subject" name="subject" placeholder="বার্তার বিষয় লিখুন" required />
      </label>
      <label htmlFor="contact-message" className="full">
        বার্তা
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="আপনার বিস্তারিত বার্তা লিখুন..."
          required
        />
      </label>
      <Button type="submit">বার্তা পাঠান</Button>
      {message ? <p className="muted full">{message}</p> : null}
    </form>
  );
}
