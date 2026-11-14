import { X } from 'lucide-react'
import { useState } from 'react'

export const LEGAL_UPDATED = '14 November 2026'
const REPO = 'github.com/HlakiDlams/Moi-Procrast-Manager'

type Tab = 'privacy' | 'terms' | 'licences'

const LICENCES: [string, string][] = [
  ['React, React DOM', 'MIT'],
  ['Capacitor (core, Android, iOS, App, Local Notifications)', 'MIT'],
  ['Dexie, dexie-react-hooks', 'Apache 2.0'],
  ['Lucide icons', 'ISC'],
  ['Bricolage Grotesque (font)', 'SIL Open Font License 1.1'],
  ['Figtree (font)', 'SIL Open Font License 1.1'],
  ['Workbox (offline support)', 'MIT'],
]

/** Privacy policy, terms of use and open-source licences, in plain language. */
export default function Legal({ start = 'privacy', onClose }: { start?: Tab; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>(start)
  return (
    <div className="sheet-backdrop modal legal-backdrop" onClick={onClose}>
      <div className="sheet modal-sheet legal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Privacy and terms">
        <div className="row-between">
          <h2>Privacy and terms</h2>
          <button type="button" className="icon-btn subtle" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="seg seg-3" role="tablist">
          {(['privacy', 'terms', 'licences'] as const).map((t) => (
            <button type="button" key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
              {t === 'privacy' ? 'Privacy' : t === 'terms' ? 'Terms' : 'Licences'}
            </button>
          ))}
        </div>

        {tab === 'privacy' && (
          <div className="legal-body">
            <p className="muted small">Last updated {LEGAL_UPDATED}</p>
            <h3>The short version</h3>
            <p>Everything you enter stays on this device. There are no accounts, no ads, no analytics, no tracking and no cookies. Nobody else, including the developer, can see your data.</p>

            <h3>What the app stores, and where</h3>
            <p>
              The app saves what you type or log: your name and profile (which can include date of birth, gender, race, height and weight), schedule, study progress, homework checks, mood, sleep,
              water, meals, steps, workouts, goals, reminders and, if you turn it on, period and symptom logs. Some of this is health information. It is kept in this app's private storage on your
              device and is used only to show it back to you and to plan your week. Every profile field is optional.
            </p>

            <h3>When data leaves your device</h3>
            <p>Only in these cases, and only when you start them:</p>
            <ul>
              <li>
                <b>Homework Checker and Explain more.</b> If you add your own Mistral AI key, the photos you choose, the subject, your grade and the question text are sent to Mistral AI
                (api.mistral.ai, a company in France) to be marked or explained. Your profile and health logs are never sent. Mistral handles that data under its own privacy policy and your own
                Mistral account. Avoid photographing names, ID numbers or other people's work.
              </li>
              <li>
                <b>Alarms.</b> On Android, an alarm you set is handed to your phone's Clock app, with its label and time.
              </li>
              <li>
                <b>Backups.</b> Export creates a file containing all your data. It goes wherever you save or send it, so keep it somewhere safe.
              </li>
            </ul>

            <h3>Permissions</h3>
            <p>
              Notifications are used for reminders. The camera and photo library are used only when you add homework pages. The motion or step sensor is used only if you turn on automatic step
              counting, and the count stays on your device. The app does not use your location, contacts or microphone.
            </p>

            <h3>Seeing, correcting and deleting your data</h3>
            <p>
              You can see and change everything in the app itself. To take a copy, use Settings, Backup, Export. To delete everything, use Settings, Delete all data, or uninstall the app. Because
              nothing is stored anywhere else, that removes it completely. To have Mistral delete what you sent it, use your Mistral account.
            </p>

            <h3>If you are under 18</h3>
            <p>
              Ask a parent or guardian before you use the app, and especially before you add an AI key or send homework photos. Under South African law (POPIA) a parent or guardian must agree to a
              child's personal information being processed.
            </p>

            <h3>Changes and contact</h3>
            <p>
              If the app ever starts handling data differently, this page will change first and the date above will be updated. Questions or requests: ask the person who shared the app with you, or
              open an issue at {REPO}.
            </p>
          </div>
        )}

        {tab === 'terms' && (
          <div className="legal-body">
            <p className="muted small">Last updated {LEGAL_UPDATED}</p>
            <h3>Using the app</h3>
            <p>
              Un-procrast-inator is a free personal study and life planner. It is provided as is, with no warranty. There is nothing to buy in the app, so there are no fees, subscriptions or refunds.
            </p>

            <h3>Study content</h3>
            <p>
              Lessons and answers are written to help you revise for South African school subjects, but they can contain mistakes and are not official exam material. Check anything important against
              your textbook, teacher or past papers. Using the app does not guarantee any result.
            </p>

            <h3>AI features</h3>
            <p>
              The Homework Checker and explanations are produced by Mistral AI. They can be wrong, so treat them as a study aid, not a final mark. You use these features with your own Mistral key, and
              any cost or limit on that account is yours. Do your own work: use the checker to find and fix mistakes, not to copy answers.
            </p>

            <h3>Health, body and exercise</h3>
            <p>
              BMI, weight ranges, cycle predictions, sleep, steps and workouts are general information and estimates. They are not medical advice, a diagnosis or contraception. Talk to a clinic, nurse
              or doctor about your health, and stop any exercise that causes pain, dizziness or trouble breathing.
            </p>

            <h3>Reminders and alarms</h3>
            <p>Phones sometimes delay or block notifications to save battery. Do not rely on the app alone for anything critical, such as an exam start time.</p>

            <h3>Your data</h3>
            <p>Your data lives only on your device. If you lose the device, clear the app's storage or uninstall it without exporting a backup, it cannot be recovered.</p>
          </div>
        )}

        {tab === 'licences' && (
          <div className="legal-body">
            <p>The app is built with open-source software and fonts. Thank you to their authors.</p>
            <ul className="history small">
              {LICENCES.map(([name, lic]) => (
                <li key={name}>
                  <span>{name}</span>
                  <span className="muted">{lic}</span>
                </li>
              ))}
            </ul>
            <p className="muted small">Lesson text and exercise descriptions were written for this app. It uses no stock photos and no third-party trackers or advertising code.</p>
          </div>
        )}
      </div>
    </div>
  )
}
