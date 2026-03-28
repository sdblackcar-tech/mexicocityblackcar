import { useLanguage } from "@/i18n/LanguageContext";
import { getPublishedPosts } from "@/data/blogPosts";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

const BlogSection = () => {
  const { t } = useLanguage();
  const posts = getPublishedPosts();

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-sm font-body tracking-[0.3em] uppercase text-gold mb-4">
            {t.nav.blog}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            Insights & Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block p-8 border border-border bg-card hover:border-gold transition-all duration-500"
            >
              <span className="text-xs font-body tracking-[0.2em] uppercase text-gold">
                {post.category}
              </span>
              <h3 className="font-display text-xl text-foreground mt-3 mb-3 group-hover:text-gold transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={12} />
                    {new Date(post.publishDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  Read <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
