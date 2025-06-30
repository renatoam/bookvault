export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 max-lg:mb-16">
      <aside>
        <p>Book Vault © {new Date().getFullYear()} - Renato Melo</p>
      </aside>
    </footer>
  )
}
