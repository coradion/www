import { useShade } from "../contexts/shade";
import { useServiceWorker } from "../contexts/service-worker";
import { useFormik } from "formik";
import { MouseEventHandler } from "react";

export const EditTask = () => {
  const openShade = useShade();
  const workbox = useServiceWorker();
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: { title: "", description: "" },
    onSubmit: (payload) => {
      openShade(false);
      if (workbox === null) return;
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
    <div onSubmit={handleSubmit}>
      <button onClick={handleClose}>❌</button>
      <form>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          onChange={handleChange}
          value={values.title}
        />
      </form>
      <form>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          value={values.description}
        />
      </form>

      <button type="submit">Create</button>
    </div>
  );
};
