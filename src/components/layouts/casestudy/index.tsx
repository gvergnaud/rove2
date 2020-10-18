import React from 'react';
import Head from 'next/head';
import copy, { Project } from '../../../copy';
import Body from '../../Body';
import Content from './content';

const CaseStudy = ({ projectName }) => {
  const project: Project = copy.caseStudy[projectName];

  const nextProjectName =
    copy.caseStudy.order[
      (copy.caseStudy.order.indexOf(projectName) + 1) %
        copy.caseStudy.order.length
    ];
  const nextProject = copy.caseStudy[nextProjectName];

  return (
    <React.Fragment key={projectName}>
      <Head>
        {/* <!-- Primary Meta Tags --> */}
        <title>{project.meta.title}</title>
        <meta name="title" content={project.meta.title} />
        <meta name="description" content={project.meta.description} />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={project.meta.url} />
        <meta property="og:title" content={project.meta.title} />
        <meta property="og:description" content={project.meta.description} />
        <meta property="og:image" content={project.meta.image} />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={project.meta.url} />
        <meta property="twitter:title" content={project.meta.title} />
        <meta
          property="twitter:description"
          content={project.meta.description}
        />
        <meta property="twitter:image" content={project.meta.image} />
      </Head>

      <Body>
        <Content
          project={project}
          nextProject={nextProject}
          nextProjectName={nextProjectName}
        />
      </Body>
    </React.Fragment>
  );
};

export default CaseStudy;
