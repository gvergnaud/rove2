import React from 'react';

import CaseStudy from '../../components/layouts/casestudy';

export default function CaseStudyPage({ name }) {
  return <CaseStudy projectName={name} />;
}

CaseStudyPage.getInitialProps = async ({ query }) => {
  return { name: query.name };
};
