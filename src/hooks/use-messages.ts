import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Tag {
  id: number;
  name: string;
}

interface MatchProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  imgUrl: string;
  compatibility: number;
  matchDate: string;
  messageCount?: number;
  tags: Tag[];
}

export const useMessages = (matches: any[]) => {
  const matchesIds = matches?.map((match) => match.id) || [];

  return useQuery<any[]>({
    queryKey: ["messages", matchesIds],
    queryFn: async () => {
      try {
        if (!matches || matches.length === 0) {
          return [];
        }

        const { data, error } = (await Promise.race([
          supabase.from("messages").select(`*`).in("match_id", matchesIds),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 10000)
          ),
        ])) as { data: any; error: any };

        if (error) {
          console.error("Error fetching profiles:", error);
          throw error;
        }

        if (!data) {
          throw new Error("No data received");
        }
        console.log(data);
        return data;
      } catch (error) {
        console.error("Query error:", error);
        throw error;
      }
    },
    refetchInterval: 5000,
    enabled: true,
    retry: 1,
    gcTime: 1000 * 60 * 30,
    staleTime: 1000 * 60 * 5,
  });
};
