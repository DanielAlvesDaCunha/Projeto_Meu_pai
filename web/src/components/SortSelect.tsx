"use client";

export function SortSelect({
  defaultValue,
  de,
  ate,
}: {
  defaultValue: string;
  de?: string;
  ate?: string;
}) {
  return (
    <form className="sort-form" method="get">
      {de ? <input type="hidden" name="de" value={de} /> : null}
      {ate ? <input type="hidden" name="ate" value={ate} /> : null}
      <label htmlFor="ordenar">Ordenar</label>
      <select
        id="ordenar"
        name="ordenar"
        defaultValue={defaultValue}
        onChange={(e) => e.currentTarget.form?.submit()}
      >
        <option value="relevancia">Relevância</option>
        <option value="menor-preco">Menor preço</option>
        <option value="maior-preco">Maior preço</option>
        <option value="nome">Nome</option>
      </select>
    </form>
  );
}
