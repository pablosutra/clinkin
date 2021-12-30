import React from 'react';

export const Error = ({message}) =>  (
    <div className="tile is-ancestor">
    <div class="tile is-vertical is-12">
      <div class="tile is-parent">
        <article class="tile is-child notification is-danger">
          <p class="title">Error</p>
          <div class="content">
            <p>
             {message}
            </p>
          </div>
        </article>
      </div>
    </div>
  </div>
)