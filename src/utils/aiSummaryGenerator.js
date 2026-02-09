import { Cerebras } from "@cerebras/cerebras_cloud_sdk";

export const generateMovieSummary = async (movie) => {
  try {
    const client = new Cerebras({
      apiKey: import.meta.env.VITE_CEREBRAS_API_KEY,
    });

    const movieData = {
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.release_date,
      rating: movie.vote_average,
      runtime: movie.runtime,
      budget: movie.budget,
      revenue: movie.revenue,
      genres: movie.genres?.map(g => g.name).join(', '),
      popularity: movie.popularity
    };

    const prompt = `Generate a creative AI-style summary of the following movie. Always begin with a short, bold one-liner that reflects your recommendation. ex: "**A definite watch!!**", "**A flashy and trashy movie, Wouln't recommend.**"(very good reviews for 7+ rating movies, average for 5-7, harsh for 3-5 and VERY harsh for 3 and below) Be very mean to movies with less than 5 in ratings and have an average review for the movies with 5-6. Then, give a short imaginative take on the movie's theme/story (1 sentence). Then, offer a statistical analysis of its performance (brief, 1–2 lines). Finally, conclude with a clear but indirect recommendation — whether it's worth watching, and why — but without directly citing numbers like reviews, rating or votes (1–2 sentences). Consider the sentiment of the reviews as well. Movie data: ${JSON.stringify(movieData)}`;

    const stream = await client.chat.completions.create({
      model: "llama3.1-8b",
      stream: true,
      max_completion_tokens: 300,
      temperature: 0.7,
      top_p: 1,
      messages: [
        {
          role: "system",
          content: "You are a smart AI film analyst who loves discovering unique insights about movies. Based on the title, story, cast, and available data, you form a narrative, offer a brief but compelling statistical analysis, and end with a subtle yet clear recommendation (very good reviews for 7+ rating movies, average for 5-7, harsh for 3-5 and VERY harsh for 3 and below) — as if you personally watched and admired (or hated) the film. Don’t be dry or too stat-heavy. Use imagination and flair and BE MEAN TO BAD MOVIES, VERY MEAN TO MOVIES WITH UNDER 5 in RATINGS and AVERAGE TO 5-6."

        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    let summary = "";
    for await (const chunk of stream) {
      summary += chunk.choices[0].delta.content || "";
    }

    return summary.trim();
  } catch (error) {
    console.error("AI Movie Summary generation failed:", error);
    return "The MovieMitra bot is asleep Zzz.";
  }
};

export const generateActorSummary = async (actor) => {
  try {
    const client = new Cerebras({
      apiKey: import.meta.env.VITE_CEREBRAS_API_KEY,
    });

    const actorData = {
      name: actor.name,
      biography: actor.biography?.substring(0, 200),
      birthday: actor.birthday,
      placeOfBirth: actor.place_of_birth,
      popularity: actor.popularity,
      knownFor: actor.known_for_department,
      knownForMovies: actor.known_for?.map(movie => movie.title || movie.name).join(', ')
    };

    const prompt = `Generate a creative AI-style summary of the following actor. Always begin with a short, bold one-liner that reflects your impression or recommendation. ex: "**A true gem of the screen!**", "**More style than substance, maybe skip.**". Then, share a brief imaginative take on their career path or acting style (1–2 sentences). Follow that with a statistical performance insight (awards, popularity, notable roles—brief, 1–2 lines). Finally, end with an indirect but clear recommendation — whether audiences should watch more of their work and why — without directly citing raw stats like popularity scores or review counts. Use **bold** and *italics* where relevant, and format the response in an engaging, paragraph-style layout. Actor data: ${JSON.stringify(actorData)}`;

    const stream = await client.chat.completions.create({
      model: "llama3.1-8b",
      stream: true,
      max_completion_tokens: 300,
      temperature: 0.7,
      top_p: 1,
      messages: [
        {
          role: "system",
          content: "You are an unbiased AI entertainment critic with a love for storytelling. Analyze an actor’s career and public perception. If bad, say so, If good say so. Be direct. Find patterns, link ideas, and make it feel like you’ve studied their work deeply. Conclude with a recommendation: should people follow their work, watch more of them, or take note of their style — but express this indirectly, like a thoughtful observation."

        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    let summary = "";
    for await (const chunk of stream) {
      summary += chunk.choices[0].delta.content || "";
    }

    return summary.trim();
  } catch (error) {
    console.error("AI Actor Summary generation failed:", error);
    return "The MovieMitra bot is asleep Zzz.";
  }
};
