export type ID = string;
export type Label = { id: ID; name: string; color: string };
export type CheckItem = { id: ID; text: string; done: boolean };
export type Attachment = { id: ID; name: string; blobKey: string; mime: string };
export type Card = {
  id: ID; columnId: ID; order: number;
  title: string; desc?: string; labels: ID[];
  assigneeId?: ID; due?: string | null;
  checklist: CheckItem[]; customFields: Record<string, string | number>;
  attachments: Attachment[]; createdAt: string; updatedAt: string;
};
export type Column = { id: ID; boardId: ID; title: string; order: number; wipLimit?: number | null; };
export type Board = {
  id: ID; name: string; createdAt: string; updatedAt: string;
  labelDefs: Record<ID, Label>;
  members: { id: ID; name: string; avatar?: string }[];
};
