#!/usr/bin/env node

const workshopper = require('workshopper');
const path        = require('path');

function fpath (f) {
    return path.join(__dirname, f);
}

workshopper({
  name        : 'seccamp2016-chacha20-workshopper',
  title       : 'Security Camp 2016 ChaCha20 Workshopper',
  subtitle    : 'Exercises for ChaCha20 in TLS Lecture',
  appDir      : __dirname,
  menuItems   : [],
  exerciseDir : fpath('./exercises/'),
//  languages: ['ja', 'en']
  languages: ['ja']
});
