import { brandStatement, trustBadges } from "@/lib/content";

export const metadata = {
  title: "আমাদের সম্পর্কে"
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container panel">
        <p className="eyebrow">About PureOrigins</p>
        <h1>আপনার পরিবার সেরা পুষ্টির যোগ্য</h1>
        <p className="lead">{brandStatement}</p>
        <p className="muted">
          PureOrigins বাংলাদেশের পরিবারগুলোর জন্য পরিষ্কার সিড, মধু ও সুপারফুড পাউডার
          সরবরাহ করে — ভেজাল ছাড়া, অতিরিক্ত দাবি ছাড়া, দৈনন্দিন রুটিনে ব্যবহারের
          জন্য সহজ প্যাকেজিংয়ে।
        </p>
        <ul className="benefit-list about-trust-list">
          {trustBadges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
