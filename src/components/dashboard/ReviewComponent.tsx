import {
  ChefInterface,
  ReviewInterface,
} from "@/app/chef/dashboard/[chefId]/page";
import { Star } from "lucide-react";

interface ReviewComponentInterface {
  chef: ChefInterface;
  reviews: ReviewInterface[];
}

export default function ReviewComponent({
  chef,
  reviews,
}: ReviewComponentInterface) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#c8a36a]">Recensioni</h2>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg bg-[#232323] p-6">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <p className="font-semibold text-white">{review.userName}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? "fill-[#c8a36a] text-[#c8a36a]"
                            : "text-white/30"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-white/70">{review.text}</p>
              </div>
              <span className="text-sm text-white/50">{review.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
