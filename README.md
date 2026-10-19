# Yes/No Status Site

A static website for GitHub Pages that answers one question with a big **YES** or **NO**. A password-protected admin page switches the answer, and a history page shows how long the current status has been active and how it changed over time.

Live site: https://yv5b45n2nd-rgb.github.io/yes-no-site/

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Public page. Shows YES or NO and since when. Refreshes every 30 seconds. |
| `stats.html` | Public history: current status, time active, last change, total changes, share of YES this month, 12-month chart, yearly table. |
| `admin.html` | Password-protected toggle that changes the status for everyone. |
| `setup.html` | One-time setup that encrypts the GitHub token with a password. Delete it after use. |

## How it works

There is no server. The status lives in `data/history.json`, a list of changes with timestamps:

```json
[
  { "status": false, "at": "2026-10-19T09:31:03Z" },
  { "status": true,  "at": "2026-10-20T08:00:00Z" }
]
```

- The current status is the last entry. All statistics are calculated in the browser from this list.
- The admin page adds a new entry by committing to the repository through the GitHub API. This needs a GitHub token.
- The token is stored encrypted (AES-256-GCM, key derived from the password with PBKDF2) in `assets/vault.js`. The admin page decrypts it in the browser when the correct password is entered. Without the password the token is not usable.
- Public pages read the static `data/history.json` served by GitHub Pages. After a change it appears once Pages has rebuilt, usually within 1 to 2 minutes.

## Setup from scratch

1. Create a public repository and upload all files, keeping the `assets` and `data` folders. The default branch must be `main` (otherwise change `branch` in `assets/common.js`).
2. In the repository go to Settings, Pages, choose "Deploy from a branch", then `main` and `/ (root)`.
3. Create a fine-grained token (GitHub, Settings, Developer settings, Personal access tokens). Limit it to this repository only, with **Contents: Read and write**, and choose the longest expiry available.
4. Open `https://YOURNAME.github.io/REPO/setup.html`, paste the token, and choose the admin password.
5. Wait 1 to 2 minutes, then open `admin.html` and test the password.
6. Delete `setup.html` from the repository.

## Using it

- Open `admin.html`, enter the password, and use the switch.
- Share only the password with the people who may change the status.

## Customising

- **Labels:** change `yes` and `no` in `CFG` at the top of `assets/common.js`.
- **Colours and layout:** edit `assets/style.css`. The colours are variables at the top, with a dark mode.
- **Custom domain:** the repository is detected automatically on `github.io`. For a custom domain, set `CFG.owner` and `CFG.repo` in `assets/common.js`.

## Maintenance

- **Token expiry:** when the token expires, the switch fails with a "Write failed" message. Create a new token, upload `setup.html` again, run it with the same or a new password, then delete it again.
- **Changing the password:** run the setup again. It overwrites `assets/vault.js`.
- **Resetting the history:** replace the contents of `data/history.json` with a single entry, for example `[{"status": false, "at": "2026-10-19T00:00:00Z"}]`.

## Limitations

- The password check happens in the browser. The encrypted token is public in the repository, so someone could attempt to guess the password offline. Use a long password if this matters. The token only has access to this one repository.
- If two people toggle at the same moment, the second attempt fails and can be repeated.
- The history is public to anyone who can open the repository.
[README.md](https://github.com/user-attachments/files/33660608/README.md)
