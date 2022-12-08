import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";

function GoalsDetailComponent() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const fetchGoalData = async () => {
    setLoading(true);
    await httpService
      .get(`/api/goals/${router.query.goal_id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          console.log(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (router?.query && router?.query?.goal_id) fetchGoalData();
  }, []);
  return <div>GoalsDetailPage</div>;
}

export default GoalsDetailComponent;
