---
layout: ../../../layouts/MarkdownLayout.astro
title: "Home Media Pi"
---

Let's try to spin up a new [Raspberry Pi](https://www.raspberrypi.com/) home server.
I'll be using an old [Raspberry Pi 4 Model B from 2018](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/).

# Getting Started

[The Raspberry Pi server's **Getting started** page is extremely helpful](https://www.raspberrypi.com/documentation/computers/getting-started.html).

I downloaded the [Raspberry Pi OS imager](https://downloads.raspberrypi.org/imager/imager_latest.dmg) and selected the `Raspberry Pi OS Lite (64-bit)` option (Released 2022-09-22).

I customized the image session:

- hostname: `rpi4b.local`
- enable ssh: `true`, ssh-ed25519 public key authentication only
- username: `alexander`
- password: redacted
- configure wireless LAN: `true`, home wifi
- locale settings: `America/Edmonton`, keyboard `us`
- enable telemetry: `false`

I plugged it in, set a reserved IP, and ssh'd in without issue. SSH Config is:

```
host rpi4b
    HostName 10.0.0.171
    User alexander
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 600
```

To verify that this initial setup is working, run `ssh rpi4b` to get into the server and update all the packages.

```bash
sudo apt update
sudo apt upgrade
```

# Server Hardening

The [NIST Cyber Security Framework](https://www.nist.gov/cyberframework) is a good read on how to think about hardening servers.
Also [Chris Approved's raspberry pi hardening article was ranked very high in search](https://chrisapproved.com/blog/raspberry-pi-hardening.html#configure-automatic-updates).

## SSH hardening

Create `ssh-users` group:

```bash
sudo groupadd ssh-users
sudo usermod -a -G ssh-users $USER
```

Edit `/etc/ssh/sshd_config` with the following changes:

```
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
UsePAM no
X11Forwarding no
AllowGroups ssh-users
```

Restart `ssh` to apply the configuration.

`sudo systemctl restart ssh`

## Automatic security updates

`sudo apt install unattended-upgrades apt-listchanges apticron`

Backed up the current conf script:

`cp /etc/apt/apt.conf.d/50unattended-upgrades config_backup/`

Then copy the following into `/etc/apt/apt.conf.d/50unattended-upgrades`

```
// Unattended-Upgrade::Origins-Pattern controls which packages are
// upgraded.
//
// Modified for Raspberry Pi, Revision 1.1
// Reference https://www.chrisapproved.com/blog/raspberry-pi-hardening.html

// Instructions
//
// Make a backup of any existing 50unattended-upgrades file in /etc/apt/apt.conf.d/
// Copy this file to /etc/apt/apt.conf.d/
// Add your e-mail address to Unattended-Upgrade::Mail below
// Make any other modifications you wish beyond the selected defaults

// Enable the update/upgrade script (0=disable)
APT::Periodic::Enable "1";

// Do "apt-get update" automatically every n-days (0=disable)
APT::Periodic::Update-Package-Lists "1";

// Do "apt-get upgrade --download-only" every n-days (0=disable)
APT::Periodic::Download-Upgradeable-Packages "1";

// Do "apt-get autoclean" every n-days (0=disable)
APT::Periodic::AutocleanInterval "7";

// Send report mail to root
//     0:  no report             (or null string)
//     1:  progress report       (actually any string)
//     2:  + command outputs     (remove -qq, remove 2>/dev/null, add -d)
//     3:  + trace on    APT::Periodic::Verbose "2";
APT::Periodic::Unattended-Upgrade "1";

Unattended-Upgrade::Origins-Pattern {
        // Codename based matching:
        // This will follow the migration of a release through different
        // archives (e.g. from testing to stable and later oldstable).
        // Software will be the latest available for the named release,
        // but the Debian release itself will not be automatically upgraded.

        // Note Raspbian does NOT have a separate security repository
        // https://www.raspberrypi.org/forums/viewtopic.php?p=680200#p680222
        "origin=Raspbian,codename=${distro_codename},label=Raspbian";
        "origin=Raspberry Pi Foundation,codename=${distro_codename},label=Raspberry Pi Foundation";
};

// Python regular expressions, matching packages to exclude from upgrading
Unattended-Upgrade::Package-Blacklist {
    // The following matches all packages starting with linux-
    //  "linux-";

    // Use $ to explicitely define the end of a package name. Without
    // the $, "libc6" would match all of them.
    //  "libc6$";
    //  "libc6-dev$";
    //  "libc6-i686$";

    // Special characters need escaping
    //  "libstdc\+\+6$";

    // The following matches packages like xen-system-amd64, xen-utils-4.1,
    // xenstore-utils and libxenstore3.0
    //  "(lib)?xen(store)?";

    // For more information about Python regular expressions, see
    // https://docs.python.org/3/howto/regex.html
};

// This option allows you to control if on a unclean dpkg exit
// unattended-upgrades will automatically run 
//   dpkg --force-confold --configure -a
// The default is true, to ensure updates keep getting installed
Unattended-Upgrade::AutoFixInterruptedDpkg "true";

// Install all updates when the machine is shutting down
// instead of doing it in the background while the machine is running.
// This will (obviously) make shutdown slower.
// Unattended-upgrades increases logind's InhibitDelayMaxSec to 30s.
// This allows more time for unattended-upgrades to shut down gracefully
// or even install a few packages in InstallOnShutdown mode, but is still a
// big step back from the 30 minutes allowed for InstallOnShutdown previously.
// Users enabling InstallOnShutdown mode are advised to increase
// InhibitDelayMaxSec even further, possibly to 30 minutes.
Unattended-Upgrade::InstallOnShutdown "false";

// Send email to this address for problems or packages upgrades
// If empty or unset then no email is sent, make sure that you
// have a working mail setup on your system. A package that provides
// 'mailx' must be installed. E.g. "user@example.com"
Unattended-Upgrade::Mail "your@e-mail-address.com";

// Set this value to "true" to get emails only on errors. Default
// is to always send a mail if Unattended-Upgrade::Mail is set
Unattended-Upgrade::MailOnlyOnError "false";

// Remove unused automatically installed kernel-related packages
// (kernel images, kernel headers and kernel version locked tools).
//Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";

// Do automatic removal of newly unused dependencies after the upgrade
//Unattended-Upgrade::Remove-New-Unused-Dependencies "true";

// Do automatic removal of unused packages after the upgrade
// (equivalent to apt-get autoremove)
Unattended-Upgrade::Remove-Unused-Dependencies "true";

// Automatically reboot *WITHOUT CONFIRMATION* if
//  the file /var/run/reboot-required is found after the upgrade
Unattended-Upgrade::Automatic-Reboot "false";

// Automatically reboot even if there are users currently logged in
// when Unattended-Upgrade::Automatic-Reboot is set to true
Unattended-Upgrade::Automatic-Reboot-WithUsers "true";

// If automatic reboot is enabled and needed, reboot at the specific
// time instead of immediately
//  Default: "now"
//Unattended-Upgrade::Automatic-Reboot-Time "02:00";

// Use apt bandwidth limit feature, this example limits the download
// speed to 70kb/sec
//Acquire::http::Dl-Limit "70";

// Enable logging to syslog. Default is False
Unattended-Upgrade::SyslogEnable "true";

// Specify syslog facility. Default is daemon
Unattended-Upgrade::SyslogFacility "daemon";

// Download and install upgrades only on AC power
// (i.e. skip or gracefully stop updates on battery)
// Unattended-Upgrade::OnlyOnACPower "true";

// Download and install upgrades only on non-metered connection
// (i.e. skip or gracefully stop updates on a metered connection)
// Unattended-Upgrade::Skip-Updates-On-Metered-Connections "true";

// Verbose logging
// Unattended-Upgrade::Verbose "false";

// Print debugging information both in unattended-upgrades and
// in unattended-upgrade-shutdown
// Unattended-Upgrade::Debug "false";
```

Verify the configuration.

`sudo unattended-upgrade -d --dry-run`

See the log location for monitoring.

`tail /var/log/unattended-upgrades/unattended-upgrades.log`

## Configure SMTP client

This enables server system alerts to be emailed to me.

`sudo apt install msmtp msmtp-mta`

`sudo vim /etc/msmtprc`

```
# Default values for all accounts
defaults
auth           on
tls            on

# Amazon SES SMTP User
account        awsses
host           email-smtp.us-west-2.amazonaws.com
port           587
tls_starttls   on
from           noreply@udia.ca
user           aws_smtp_username
password       aws_smtp_password

# Syslog logging with facility LOG_MAIL instead of the default LOG_USER.
syslog LOG_MAIL

# Set a default account
account default : awsses
```

Replace *aws_smtp_username* and *aws_smtp_password* with your SMTP user details.

Logs are available at `/var/log/mail.log`.

Test the configuration

```bash
echo "This is a test email" | msmtp --debug your@emailaddress.com
```
