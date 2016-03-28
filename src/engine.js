"use strict";

import {render} from './renderer';
import {clean} from './component';
import {model} from './model';

const cssContainer = document.createElement('div');
cssContainer.id = '--rendered-styles';
document.body.appendChild(cssContainer);

const Schema = {};
Schema.engine = render;
Schema.clean = clean;
Schema.model = model;

export default Schema;
