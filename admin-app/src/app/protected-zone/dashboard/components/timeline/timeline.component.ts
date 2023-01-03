import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline',
  template: `
    <div class="card-body">
      <ul class="timeline">
        <li>
          <div class="timeline-badge"><i class="fas fa-check"></i></div>
          <div class="timeline-panel">
            <div class="timeline-heading">
              <h4 class="timeline-title">Lorem ipsum dolor</h4>
              <p>
                <small class="text-muted"><i class="far fa-clock"></i> 11 hours ago via Twitter</small>
              </p>
            </div>
            <div class="timeline-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero laboriosam dolor perspiciatis omnis
                exercitationem. Beatae, officia pariatur? Est cum veniam excepturi. Maiores praesentium, porro voluptas
                suscipit facere rem dicta, debitis.
              </p>
            </div>
          </div>
        </li>
        <li class="timeline-inverted">
          <div class="timeline-badge warning"><i class="fas fa-credit-card"></i></div>
          <div class="timeline-panel">
            <div class="timeline-heading">
              <h4 class="timeline-title">Lorem ipsum dolor</h4>
            </div>
            <div class="timeline-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem dolorem quibusdam, tenetur commodi
                provident cumque magni voluptatem libero, quis rerum. Fugiat esse debitis optio, tempore. Animi officiis
                alias, officia repellendus.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium maiores odit qui est tempora eos,
                nostrum provident explicabo dignissimos debitis vel! Adipisci eius voluptates, ad aut recusandae minus
                eaque facere.
              </p>
            </div>
          </div>
        </li>
        <li>
          <div class="timeline-badge danger"><i class="fas fa-bomb"></i></div>
          <div class="timeline-panel">
            <div class="timeline-heading">
              <h4 class="timeline-title">Lorem ipsum dolor</h4>
            </div>
            <div class="timeline-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus numquam facilis enim eaque,
                tenetur nam id qui vel velit similique nihil iure molestias aliquam, voluptatem totam quaerat, magni
                commodi quisquam.
              </p>
            </div>
          </div>
        </li>
        <li class="timeline-inverted">
          <div class="timeline-panel">
            <div class="timeline-heading">
              <h4 class="timeline-title">Lorem ipsum dolor</h4>
            </div>
            <div class="timeline-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates est quaerat asperiores sapiente,
                eligendi, nihil. Itaque quos, alias sapiente rerum quas odit! Aperiam officiis quidem delectus libero,
                omnis ut debitis!
              </p>
            </div>
          </div>
        </li>
        <li>
          <div class="timeline-badge info"><i class="fas fa-save"></i></div>
          <div class="timeline-panel">
            <div class="timeline-heading">
              <h4 class="timeline-title">Lorem ipsum dolor</h4>
            </div>
            <div class="timeline-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis minus modi quam ipsum alias at est
                molestiae excepturi delectus nesciunt, quibusdam debitis amet, beatae consequuntur impedit nulla qui!
                Laborum, atque.
              </p>
              <hr />
              <div class="btn-group">
                <button class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" type="button">
                  <i class="fas fa-cog"></i> <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" role="menu">
                  <li><a>Action</a></li>
                  <li><a>Another action</a></li>
                  <li><a>Something else here</a></li>
                  <li class="divider"></li>
                  <li><a>Separated link</a></li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="timeline-panel">
            <div class="timeline-heading">
              <h4 class="timeline-title">Lorem ipsum dolor</h4>
            </div>
            <div class="timeline-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi fuga odio quibusdam. Iure expedita,
                incidunt unde quis nam! Quod, quisquam. Officia quam qui adipisci quas consequuntur nostrum sequi.
                Consequuntur, commodi.
              </p>
            </div>
          </div>
        </li>
        <li class="timeline-inverted">
          <div class="timeline-badge success"><i class="fas fa-graduation-cap"></i></div>
          <div class="timeline-panel">
            <div class="timeline-heading">
              <h4 class="timeline-title">Lorem ipsum dolor</h4>
            </div>
            <div class="timeline-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt obcaecati, quaerat tempore officia
                voluptas debitis consectetur culpa amet, accusamus dolorum fugiat, animi dicta aperiam, enim incidunt
                quisquam maxime neque eaque.
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `,
  standalone: true
})
export class TimelineComponent {
  constructor() {}
}
