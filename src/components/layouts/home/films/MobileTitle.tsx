import React from 'react';
import { css } from 'emotion';
import {
  mqSmall,
  grey,
  fsLarge,
  lWindowPadding
} from '../../../../style/variables';

import { Project } from '../../../../copy';
import LinkWithTransition from '../../../LinkWithTransition';
import { createLinkProps } from '../../../../routes';

export const MobileTitle = ({ project }: { project: Project }) => (
  <div
    className={css`
      display: none;
      ${mqSmall(
        css`
          display: block;
          padding: 20px ${lWindowPadding};
          text-transform: uppercase;
          color: ${grey};
          ${fsLarge};

          .watch {
            text-decoration: underline;
          }
        `
      )}
    `}
  >
    <p className="title">{project.title}</p>
    <LinkWithTransition
      color={project.backgroundRgba}
      {...createLinkProps('casestudy', { name: project.name })}
    >
      <p className="watch">{project.subtitle}</p>
    </LinkWithTransition>
  </div>
);
