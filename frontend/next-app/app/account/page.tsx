import { account } from "@/lib/content";

export const metadata = {
  title: "আমার অ্যাকাউন্ট"
};

export default function AccountPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">অ্যাকাউন্ট</p>
            <h1>{account.title}</h1>
            <p className="muted">{account.subtitle}</p>
          </div>
        </div>
        <div className="account-layout">
          <div className="panel">
            <h2>{account.loginTitle}</h2>
            <p className="muted">{account.loginIntro}</p>
            <p className="muted">
              ফোন লগইন ও অর্ডার হিস্ট্রি শীঘ্রই এই পেজে সংযুক্ত হবে।
            </p>
          </div>
          <div className="panel">
            <h2>{account.ordersTitle}</h2>
            <p className="muted">{account.ordersIntro}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
