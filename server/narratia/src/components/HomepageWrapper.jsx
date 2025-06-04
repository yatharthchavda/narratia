import React from "react";
import Layout from "./Layout";
import Homepage from "./Homepage";

export default function HomepageWrapper(props) {
  return (
    <Layout>
      <Homepage {...props} />
    </Layout>
  );
}