import { useSocket } from "@/components/providers/SocketIoProvider";
import qs from "query-string";
import { useOrigin } from "./useOrigin";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

type UseChatQueryProps = {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: UseChatQueryProps) => {
    const {isConnected} = useSocket()
    const origin = useOrigin()

    const fetchMessages = async ({pageParam = undefined}) => {
        const url = qs.stringifyUrl({
            url: `${apiUrl}`,
            query: {
                cursor:pageParam,
                [paramKey]:paramValue
            }
        }, {skipNull: true})

        const res = await axios.get(url);
        return res.data;
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: !isConnected ? 1000 : false,
    })

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch
    }
};

export default useChatQuery;