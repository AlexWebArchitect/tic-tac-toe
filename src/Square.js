import React from 'react';

export default function Square(props) {
  return (
    <button className={props.sclass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}