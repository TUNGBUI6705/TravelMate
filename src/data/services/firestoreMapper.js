/**
 * Map a query document snapshot to an object with an id property
 * @template T
 * @param {QueryDocumentSnapshot} snapshot
 * @returns {T & {id: string}}
 */
export const mapQueryDoc = (snapshot) => {
  const data = snapshot.data();
  return {
    ...data,
    id: data.id ?? snapshot.id,
  };
};

/**
 * Map a document snapshot to an object with an id property, or null if document doesn't exist
 * @template T
 * @param {DocumentSnapshot} snapshot
 * @returns {(T & {id: string}) | null}
 */
export const mapDoc = (snapshot) => {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    ...data,
    id: data.id ?? snapshot.id,
  };
};
