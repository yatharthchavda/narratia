import React from "react";
import Layout from "./Layout";
import MyStories from "./MyStories";

export default function MyStoriesWrapper(props) {
  return (
    <Layout>
      <MyStories {...props} />
    </Layout>
  );
}