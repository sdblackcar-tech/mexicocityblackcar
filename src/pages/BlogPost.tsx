import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts, getPublishedPosts } from "@/data/blogPosts";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const published = getPublishedPosts();
  const post = published.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-6 lg:px-12 max-w-3xl text-center">
            <h1 className="font-display text-4xl text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">This post doesn't exist or hasn't been published yet.</p>
            <Link to="/#blog" className="text-gold hover:underline">← Back to Home</Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          <span className="text-xs font-body tracking-[0.2em] uppercase text-gold">
            {post.category}
          </span>

          <h1 className="font-display text-3xl md:text-5xl text-foreground mt-3 mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-12">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              {new Date(post.publishDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>

          <div className="prose prose-invert prose-gold max-w-none">
            {post.body.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return (
                  <h2 key={i} className="font-display text-xl text-gold mt-10 mb-4">
                    {paragraph.replace(/\*\*/g, "")}
                  </h2>
                );
              }
              // Check for inline bold
              const parts = paragraph.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={i} className="text-muted-foreground leading-relaxed mb-6">
                  {parts.map((part, j) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={j} className="text-foreground font-medium">
                        {part.replace(/\*\*/g, "")}
                      </strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </p>
              );
            })}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
