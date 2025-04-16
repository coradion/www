import styled from "styled-components";

export const IconButton = styled.button`
  ${(p) => p.theme.css.glass};
  cursor: pointer;
  padding: 0.5rem;
  margin: 0.5rem;
  width: 3rem;
  height: 3rem;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: border-color 0.1s ease;
  :focus {
    outline: none;
    border-color: deepskyblue;
  }
`;
