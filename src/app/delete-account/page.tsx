import { Metadata } from "next";
import AuthAwareLogo from "@/components/AuthAwareLogo";

export const metadata: Metadata = {
  title: "Delete Account | Healing Milestones",
  description:
    "Instructions to permanently delete your Healing Milestones account and associated data.",
};

export default function DeleteAccountPage() {
  return (
    <div className="legal-page">
      <header className="banner" style={{ position: "relative", top: 0 }}>
        <AuthAwareLogo showConnect={false} />
      </header>

      <main className="legal-main">
        <div className="glass-card legal-content">
          <h1 className="legal-title">Account &amp; Data Deletion</h1>
          <p className="legal-last-updated">
            App: Healing Milestones (Genesis Apps)
          </p>

          <div className="legal-body">
            <h2>1. How to Delete Your Account in the App</h2>
            <p>
              You can permanently delete your Healing Milestones account and all
              associated data directly from the mobile app:
            </p>
            <ul>
              <li>Open the <strong>Healing Milestones</strong> app and sign in.</li>
              <li>Go to <strong>Profile → Settings</strong>.</li>
              <li>Tap <strong>Delete Account</strong> and confirm your request.</li>
            </ul>

            <h2>2. How to Request Deletion Without App Access</h2>
            <p>
              If you no longer have access to the app, you may request account
              deletion by emailing{" "}
              <a href="mailto:support@healingmilestones.in?subject=Delete%20Account%20Request">
                support@healingmilestones.in
              </a>{" "}
              from your registered email address or including your registered
              phone number and username with the subject{" "}
              <strong>Delete Account Request</strong>.
            </p>

            <h2>3. Data That Is Deleted</h2>
            <p>
              When your account deletion request is processed, the following data
              is permanently deleted:
            </p>
            <ul>
              <li>Account profile (name, username, email, phone number, photo).</li>
              <li>Healing journeys, milestones, stories, comments, and chat messages.</li>
              <li>Medical Vault lab reports, prescriptions, and extracted biomarkers.</li>
              <li>Shared Health Snapshots and HM Connect roster entries.</li>
            </ul>

            <h2>4. Data Retention</h2>
            <p>
              Active account data is removed immediately upon confirmation.
              Residual encrypted backups and security/audit logs are
              automatically purged within <strong>30 days</strong>, unless
              longer retention is required by applicable law.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
