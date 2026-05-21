import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

const Google_review = ({ data }: Props) => {
  const reviews = data.googleReviews;
  if (!reviews.length) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-center text-[30px] md:text-[40px] mb-8 uppercase">Google Reviews</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-5 text-black">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
            <div className="text-yellow-500 text-sm mb-2">
              {"★".repeat(item.rating)}
              {item.ago ? <span className="text-gray-400 ml-2">• {item.ago}</span> : null}
            </div>
            <p className="text-sm text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Google_review;
