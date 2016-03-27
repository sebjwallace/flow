"use strict";

import {render} from './renderer';

const cssContainer = document.createElement('div');
cssContainer.id = '--rendered-styles';
document.body.appendChild(cssContainer);

const Schema = {};
Schema.engine = render;

export default Schema;
