export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
          <p>
            By accessing and using the Elite Basketball Association (EBA) website and services,
            you agree to be bound by these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
          <p>
            You are responsible for maintaining the security of your account and for all activities
            that occur under your account. You must provide accurate information when creating your profile.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">User Conduct</h2>
          <p>You agree to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Not use offensive, inappropriate, or harmful language</li>
            <li>Not impersonate other users or players</li>
            <li>Not attempt to manipulate statistics or game data</li>
            <li>Respect other players and league officials</li>
            <li>Follow all league rules and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Content</h2>
          <p>
            You retain ownership of content you post (comments, profile information, etc.), but grant
            EBA a license to display and distribute this content as part of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Termination</h2>
          <p>
            EBA reserves the right to suspend or terminate accounts that violate these terms or
            engage in behavior harmful to the community.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
          <p>
            The EBA platform is provided "as is" without warranties of any kind. We are not responsible
            for any losses or damages arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the platform
            constitutes acceptance of any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p>
            For questions about these terms, please contact the EBA administration team.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Last updated: January 3, 2026
        </p>
      </div>
    </div>
  );
}
