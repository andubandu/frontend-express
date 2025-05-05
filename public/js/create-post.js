document.getElementById('createPostForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const media = document.getElementById('media').files[0];
  
    if (!title || !content) {
      document.getElementById('msg').textContent = "Title and content are required.";
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (media) formData.append('media', media);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("You must be logged in to create a post.");
        return;
      }
  
      const response = await axios.post('https://express-backend-sigma.vercel.app/posts/new', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.data) {
        const postId = response.data._id; 
        window.location.href = `/posts/${postId}`;
      }
    } catch (error) {
      console.error('Error creating post:', error);
      document.getElementById('msg').textContent = error.response?.data?.message || 'An error occurred.';
    }
  });
  