import {
  defer,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const heading = "Welcome to Remix on Cloudflare!";

  // parse the search params for `?q=`
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  const message = getMessage(query)

  return defer({
    heading,
    message,
  });
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export default function Index() {
  const { heading, message } = useLoaderData<typeof loader>();
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">{heading}</h1>

      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <Await resolve={message}>
          {(message) => <p className="mt-4">{message}</p>}
        </Await>
      </Suspense>

      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
            rel="noreferrer"
          >
            Cloudflare Pages Docs - Remix guide
          </a>
        </li>
      </ul>
    </div>
  );
}

const getMessage = async (query: string | null) => {
  // sleep 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (!query) {
    return "No query provided.";
  }

  if ("not-found" === query) {
    // NOT WORKING
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return `You searched for "${query}".`;
}
