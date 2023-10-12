"use client"
import axios, { AxiosResponse, AxiosError  } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { experimental_useFormStatus } from "react-dom";
const controller = new AbortController();
export const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-type": "application/json" },
});

export const query = <T>(
  url: string,
  // queryString: {[key: string]: any},
  key: any[] = [],
  options = {},
  headers = {}
) => {
  
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiClient.get<T>(url, {
        headers: {
          ...headers,
        },
        signal: controller.signal
      });
      return data;
    },
    ...options,
    onError(error) {
      console.log('🚀 error query processor 🚀')
    },
    onSuccess(data) {
      console.log('🚀 succes query processor 🚀')
    },
  });
};

type HttpMutationMethod = "DELETE" | "POST" | "PUT" | "PATCH";

const mutationMethod = async <T>(
  url: string,
  method: HttpMutationMethod,
  value: T,
  headers = {}
) => {
  switch (method) {
    case "DELETE": {
      const { data } = await apiClient.delete<T>(url, {
        headers: {
          ...headers,
        },
        signal: controller.signal
      });
      return data;
    }

    case "PATCH": {
      const { data } = await apiClient.patch<T>(url, value, {
        headers: {
          ...headers,
        },
        signal: controller.signal
      });
      return data;
    }
    case "POST": {
      const { data } = await apiClient.post<T>(url, value, {
        headers: {
          ...headers,
        },
        signal: controller.signal
      });
      return data;
    }
    case "PUT": {
      const { data } = await apiClient.put<T>(url, value, {
        headers: {
          ...headers,
        },
        signal: controller.signal
      });
      return data;
    }

    default:
      throw new Error("Invalid mutation method");
  }
};

export const mutate = <T, K>(
  url: string,
  method: HttpMutationMethod,
  key: any[],
  options = {},
  headers = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (value: T) =>
      mutationMethod<T>(url, method, value, headers) as K,
    onMutate: (newData: T) => {
      const previousData = queryClient.getQueryData<T>(key);
      const isArray = Array.isArray(previousData);

      //checking if the previous data is an array type if yes then update the array data
      if (isArray) {
        // @ts-ignore
        // @ts-nocheck
        queryClient.setQueryData(key, (old) => [...old, newData]);
      } else {
        // if not then update the single object data with the new data
        queryClient.setQueryData(key, newData);
      }
      return { previousData };
    },
    onError: (err, newTodo, context) => {
      if (axios.isAxiosError(err)) {
        // err.response?.data.message if nestjs backend
        // err.response?.data if nextjs backend
        console.error(err.response?.data);
        // toast.error(err.response?.data)
      } else {
        console.error(err);
      }
      // @ts-ignore
      // @ts-nocheck
      queryClient.setQueryData(key, context.previousData);
      console.log(' 🚀 error mutate processor 🚀')
    },
    onSuccess(data, variables, context) {
      console.log(' 🚀 success mutate processor 🚀')
    },
    onSettled: (data) => {
      queryClient.invalidateQueries(key);
      console.log(' 🚀 settled mutate processor 🚀')
    },
  });
};