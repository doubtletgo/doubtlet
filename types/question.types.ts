export type QuestionListItem = {
  Question_Link: string;
  Question: string;
  QuestionDisplay: string;
  Main_Subject: string;
  Sub_Subject: string;
  TotalLikeDislike: {
    Like: number;
    Dislike: number;
  };
  id: string;
};

export type PageProps = {
  params: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [k: string]: any;
  };
  searchParams: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [k: string]: any;
  };
};

export type SolutionResponse = {
  QuestionSearch: string;
  QuestionId: string;
  QuestionDisplayText: string;
  QuestionFound: string;
  likeDislike: string;
  Answer: string;
  MarkdownAnswer: string;
  MarkdownQuestion: string;
  debug: string;
};
