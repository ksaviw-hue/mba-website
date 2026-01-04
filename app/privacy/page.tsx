export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
          <p>
            When you log in with Roblox, we collect your Roblox username, user ID, and profile picture
            to create and manage your EBA player profile.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Create and maintain your player profile</li>
            <li>Display your statistics and game history</li>
            <li>Allow you to participate in league activities</li>
            <li>Enable team communication features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Data Storage</h2>
          <p>
            Your data is stored securely using Supabase. We do not share your personal information
            with third parties except as required to operate the EBA platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
          <p>
            You can request deletion of your account and data at any time by contacting the league administrators.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p>
            For privacy-related questions, please contact the MBA administration team.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Last updated: January 3, 2026
        </p>
      </div>
    </div>
  );
}

