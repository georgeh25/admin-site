import React from "react";
import {
  fetchProjects,
  fetchAboutMe,
  fetchSocialNetworks,
} from "../../utils/api";

async function getData() {
  const projects = await fetchProjects();
  const aboutMe = await fetchAboutMe();
  const socialNetworks = await fetchSocialNetworks();
  return { projects, aboutMe, socialNetworks };
}

export default async function DebugPage() {
  const data = await getData();

  return (
    <div className="container py-5">
      <h1>Debug Page</h1>
      <h2>Projects</h2>
      <pre>{JSON.stringify(data.projects, null, 2)}</pre>
      <h2>About Me</h2>
      <pre>{JSON.stringify(data.aboutMe, null, 2)}</pre>
      <h2>Social Networks</h2>
      <pre>{JSON.stringify(data.socialNetworks, null, 2)}</pre>
    </div>
  );
}
