import styled, { css } from "styled-components";
import { position, transparentize } from "polished";
import { useShade } from "../contexts/shade";
import { useServiceWorker } from "../contexts/service-worker";
import { useFormik } from "formik";
import { MouseEventHandler} from "react";

const Card = styled.form`
  ${(p) => p.theme.css.glass}
  color: seashell;
  margin: 1rem;
  position: relative;
`;

const Close = styled.button`
  ${position("absolute", 0, 0, null, null)};
  width: 2rem;
  height: 2rem;
  border-radius: 0 1rem;
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${transparentize(0.95, "seashell")};
  transition: background-color 0.1s ease;
  cursor: pointer;
  :hover {
    background-color: ${transparentize(0.9, "seashell")};
  }
`;

const Submit = styled.button`
  height: 2rem;
  border-radius: 0 0 1rem 1rem;
  border: none;
  background-color: ${transparentize(0.95, "deepskyblue")};
  transition: background-color 0.1s ease;
  cursor: pointer;
  width: 100%;
  :hover {
    background-color: ${transparentize(0.9, "deepskyblue")};
  }
`;

const baseTextCss = css`
  color: seashell;
  background-color: ${transparentize(0.95, "seashell")};
  transition: background-color 0.1s ease;
  padding: 1rem;
  border: none;
  :focus-visible {
    outline: none;
    background-color: ${transparentize(0.9, "seashell")};
  }
`;

const Label = styled.label`
  color: seashell;
`;

const Textarea = styled.textarea`
  ${baseTextCss};
`;

const Input = styled.input`
  ${baseTextCss};
`;

const FormGroup = styled.div`
  margin: 1rem;
  display: flex;
  flex-flow: column;
`;

export const EditTask = () => {
  const openShade = useShade();
  const workbox = useServiceWorker();
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: { title: "", description: "" },
    onSubmit: (payload) => {
      openShade(false);
      if(workbox === null) return;
      workbox.messageSW({
        type: "createTask",
        payload,
      });
    },
  });

  const handleClose: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    openShade(false);
  };

  return (
    <Card onSubmit={handleSubmit}>
      <Close onClick={handleClose}>❌</Close>
      <FormGroup>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          onChange={handleChange}
          value={values.title}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          onChange={handleChange}
          value={values.description}
        />
      </FormGroup>

      <Submit type="submit">Create</Submit>
    </Card>
  );
};
