import axiosIstance from "@/lib/axios";
import { Review, User } from "@prisma/client";
import { ChevronsLeftRightEllipsis, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface ChefReviewComponent {
  reviews: Review[];
  firstname: string;
}

export default function ChefReviewComponent({
  reviews,
  firstname,
}: ChefReviewComponent) {
  const [mean, setMean] = useState(0);
  const [users, setUsers] = useState<undefined | User[]>(undefined);
  console.log(reviews);

  const fetchReviewUser = async () => {
    const userPromises = await Promise.all(
      reviews.map((elem) => axiosIstance.get(`users/${elem.userId}`)),
    );
    setUsers(userPromises.map((response) => response.data));
  };

  useEffect(() => {
    const countMean = () => {
      let notMean = 0;
      reviews.forEach((elem) => {
        notMean += elem.rating;
      });
      notMean /= reviews?.length;
      setMean(notMean);
    };
    countMean();
    fetchReviewUser();
  }, []);
  useEffect(() => {
    console.log(users);
  }, [users]);

  console.log(mean);
  if (users != undefined) {
    return (
      <div className="mx-auto p-4 lg:max-w-4xl 2xl:max-w-7xl">
        <h1 className="py-4 text-center text-4xl">Recensioni su {firstname}</h1>
        <h2 className="flex items-center justify-center gap-2 py-8 text-white/70">
          <Star color="#c8a36a" fill="#c8a36a" />
          {mean} <ChevronsLeftRightEllipsis size={18} />
          {reviews?.length} servizi
        </h2>
        <div className="carousel carousel-center rounded-box max-w-full gap-4">
          {reviews.map((rev, index) => {
            return (
              <div
                key={`${rev.id}-${index}`}
                className="carousel-item max-w-1/2 rounded-2xl bg-[#0A0A0A] p-4 shadow-2xl md:max-w-1/3 xl:max-w-1/4"
              >
                <div className="flex max-w-full flex-col gap-2 text-center">
                  <h1 className="flex justify-center">
                    <Star color="#c8a36a" />
                    {rev.rating}/5
                  </h1>
                  <h2>
                    {users[index].firstname} {users[index].lastname}
                  </h2>
                  <h2>{rev.text}</h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
