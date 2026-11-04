import axios from "axios";
import { useState } from "react";
import type { BikeModel, CreateBikeModel } from "../models/BikeModel";

export const useBikesProvider = () => {
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (page: number, limit: number) => {
    setIsLoading(true);
    axios
      .get<{ totalCount: number; bikes: BikeModel[] }>(
        "http://localhost:3000/bikes",
        { params: { page, limit } },
      )
      .then((result) => {
        setBikes(result.data.bikes);
        setTotalCount(result.data.totalCount);
      })
      .finally(() => setIsLoading(false));
  };

  // The requests are returned so the caller can react to errors (e.g. 409)
  const createBike = (input: CreateBikeModel) =>
    axios.post<BikeModel>("http://localhost:3000/bikes", input);

  const deleteBike = (id: string) =>
    axios.delete(`http://localhost:3000/bikes/${id}`);

  return { bikes, totalCount, isLoading, load, createBike, deleteBike };
};