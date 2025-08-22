export default function Contact() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-center p-10">
      <h2 className="text-4xl font-bold mb-6">Thank You for Visiting!</h2>
      <p className="mb-4">Feel free to reach out:</p>
      <div className="space-y-2">
        <a href="mailto:your.email@example.com" className="hover:underline">your.email@example.com</a>
        <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
        <a href="https://github.com/yourgithub" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
      </div>
    </section>
  );
}
