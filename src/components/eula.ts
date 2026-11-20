/** The End User Licence Agreement. A string is a paragraph; an array is a bullet list. */
export const EULA_EFFECTIVE = '20 November 2026'

export interface EulaSection {
  title: string
  body: (string | string[])[]
}

export const EULA: EulaSection[] = [
  {
    title: '1. Who this agreement is between',
    body: [
      'This End User License Agreement ("EULA") is a legal agreement between you ("you" or "the User") and HFactor543 Studios ("we", "us" or "the Licensor"), the creator and owner of Un-procrast-inator ("the Software"), including its Android, iOS and web versions.',
      'By downloading, installing or using the Software you agree to this EULA. If you do not agree, do not install or use it. If you are under 18, a parent or guardian must agree to this EULA for you, and should help you with the AI features and with sending feedback.',
    ],
  },
  {
    title: '2. Licence grant',
    body: [
      'We give you a free, personal, non-exclusive, non-transferable, revocable licence to download, install and use the Software on devices you own or control, for your own personal, non-commercial use, as long as you follow this EULA.',
      'The Software is licensed, not sold. You do not become the owner of the Software or of any copy of it.',
    ],
  },
  {
    title: '3. What you may not do',
    body: [
      'Unless the law clearly allows it, you may not:',
      [
        'copy, sell, rent, lease, sublicense or redistribute the Software, or offer it for download anywhere else;',
        'modify, translate, reverse engineer, decompile or disassemble the Software, or try to get its source code;',
        'remove or change any copyright notices, branding or logos of HFactor543 Studios;',
        'use the Software for anything illegal, harmful or fraudulent;',
        'use the Software, or parts of it, to build a competing product;',
        'get around any security or technical limits built into the Software.',
      ],
    ],
  },
  {
    title: '4. Ownership',
    body: [
      'The Software, including its code, design, name, logos, graphics, built-in lessons, exercises and text, and all updates, belongs to HFactor543 Studios and is protected by copyright and other intellectual property laws. All rights not clearly given to you in this EULA are kept by HFactor543 Studios.',
      'What you create in the Software belongs to you: your tasks, notes, logs and goals, and lessons you ask an AI service to write for you, as far as the law allows. We claim no rights in it.',
    ],
  },
  {
    title: '5. Your data and privacy',
    body: [
      'The Software stores your information on your own device: your name and profile, schedule, study progress, homework checks, health and wellbeing logs (including optional period and symptom logs), goals and settings. There are no accounts, ads, analytics or tracking. HFactor543 Studios does not collect, sell or share your personal information.',
      'Data leaves your device only when you start it: using an AI feature with your own API key (sent to the AI service you picked), sending feedback, exporting a backup, or setting an alarm in your phone’s Clock app. The Privacy tab explains each of these. We handle personal information in line with the Protection of Personal Information Act 4 of 2013 (POPIA).',
      'If a future version collects personal information, we will tell you first and update the Privacy tab.',
      'You are responsible for backing up your own data (Settings, Backup, Export). If you uninstall the Software, clear its storage, or your device is lost or damaged, your data may be lost.',
    ],
  },
  {
    title: '6. Updates and beta versions',
    body: [
      'The Software is in beta. It may contain errors, features may change or be removed, and data may be lost. Updates are installed by you; nothing updates itself. We are not obliged to provide updates, support or maintenance, and we may change or remove features.',
    ],
  },
  {
    title: '7. Third-party components and services',
    body: [
      'The Software includes open-source libraries and fonts. Those parts are covered by their own licences (see the Open source tab), and nothing in this EULA limits your rights under them.',
      'If you use an AI service (such as Mistral, OpenAI or another you choose), or open a link to an outside website, that service or site is run by someone else and has its own terms, privacy policy and costs. We are not responsible for them.',
    ],
  },
  {
    title: '8. Not professional advice',
    body: [
      'Un-procrast-inator is a planning and learning tool. It is not medical, psychological, financial, legal or professional advice. BMI, weight ranges, cycle predictions, sleep, steps and workouts are general information and estimates, not a diagnosis and not contraception. Talk to a clinic, nurse or doctor about your health, and stop any exercise that causes pain, dizziness or trouble breathing.',
      'Lessons and answers, including AI-written ones, can contain mistakes and are not official exam material. Using the Software does not guarantee any marks or result.',
      'Reminders, timers and alarms can fail (for example because of device settings, battery saving or a bug), so do not rely on the Software alone for anything important, urgent or time-critical.',
    ],
  },
  {
    title: '9. No warranty',
    body: [
      'To the fullest extent the law allows, the Software is provided "as is" and "as available", without any warranties, whether express or implied, including warranties that it will be error-free, uninterrupted, secure or fit for a particular purpose.',
      'Nothing in this EULA limits any rights you have that cannot be excluded by law, including under the Consumer Protection Act 68 of 2008, where it applies.',
    ],
  },
  {
    title: '10. Limitation of liability',
    body: [
      'To the fullest extent the law allows, HFactor543 Studios will not be liable for any indirect, incidental, special or consequential loss or damage, including lost data, missed deadlines, lost marks, lost income or lost opportunities, arising from your use of, or inability to use, the Software, even if we were told such loss was possible.',
      'Because the Software is free, our total liability to you for any claim related to it is limited to R0 (zero rand), except where the law does not allow this limit.',
    ],
  },
  {
    title: '11. Termination',
    body: [
      'This EULA stays in force until it ends. It ends automatically if you break any of its terms. You can end it at any time by uninstalling the Software and deleting all copies.',
      'When it ends, you must stop using the Software and delete all copies. Sections 4, 9, 10 and 12 continue to apply after it ends.',
    ],
  },
  {
    title: '12. Governing law',
    body: ['This EULA is governed by the laws of the Republic of South Africa. Any dispute will be handled by the courts of South Africa.'],
  },
  {
    title: '13. Changes to this EULA',
    body: [
      'We may update this EULA from time to time. The latest version is always inside the Software (Settings, About), with its effective date at the top. If you keep using the Software after a change, you accept the updated EULA.',
    ],
  },
  {
    title: '14. Whole agreement',
    body: [
      'This EULA, together with the Privacy tab, is the full agreement between you and HFactor543 Studios about the Software. If any part of it is found to be invalid or unenforceable, the rest still applies.',
    ],
  },
  {
    title: '15. Contact',
    body: [
      'Questions about this EULA: use Settings, About, Send feedback in the app, or open an issue on the project page at github.com/HlakiDlams/Moi-Procrast-Manager. An email address will be added here when the studio has one.',
      '© 2026 HFactor543 Studios. All rights reserved.',
    ],
  },
]
