import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <h1>New post</h1>

      <div>
        <label>
          Title
          <input name="title" type="text" required />
        </label>
      </div>

      <div>
        <label>
          Slug
          <input name="slug" type="text" required />
        </label>
      </div>

      <div>
        <label>
          Content
          <textarea name="content" rows={10} required />
        </label>
      </div>

      <button type="submit">Create post</button>
    </form>
  );
}
