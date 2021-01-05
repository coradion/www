import { Layout } from "layout";
import { FunctionComponent } from "react";
import { CoradionLogo } from "../components/coradion-logo";
import styled from "styled-components";
import { transparentize } from "polished";

const StackedColorSquare = styled.div`
  width: 61.8vmin;
  height: 61.8vmin;
  background: ${transparentize(0.8, "seashell")};
  border-radius: 61.8vmin;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0.618rem 1.618rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  margin: calc(38.2vmin / 2) auto;
`;

const WordMark = styled.h1`
  flex: 1;
  font-size: 10vmin;
  margin: 0;
`;

const IndexPage: FunctionComponent = () => (
  <Layout title="Coradion">
    <StackedColorSquare>
      <CoradionLogo size="61.8%" />
      <WordMark>coradion</WordMark>
    </StackedColorSquare>
  </Layout>
);

export default IndexPage;
