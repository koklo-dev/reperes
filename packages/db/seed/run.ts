import { createDb } from '../src/index';
import { regimes } from './regimes';
import { sources } from './sources';

const db = createDb();
try {
  await db
    .insertInto('source')
    .values(sources)
    .onConflict((oc) =>
      oc.column('name').doUpdateSet((eb) => ({ url: eb.ref('excluded.url'), licence: eb.ref('excluded.licence') })),
    )
    .execute();
  await db
    .insertInto('regime')
    .values(regimes)
    .onConflict((oc) =>
      oc
        .columns(['kind', 'label', 'start_date'])
        .doUpdateSet((eb) => ({
          end_date: eb.ref('excluded.end_date'),
          cohabitation: eb.ref('excluded.cohabitation'),
        })),
    )
    .execute();
  const [s, r] = await Promise.all([
    db
      .selectFrom('source')
      .select((eb) => eb.fn.countAll<string>().as('n'))
      .executeTakeFirstOrThrow(),
    db
      .selectFrom('regime')
      .select((eb) => eb.fn.countAll<string>().as('n'))
      .executeTakeFirstOrThrow(),
  ]);
  console.log(`seed OK : ${s.n} sources, ${r.n} régimes`);
} finally {
  await db.destroy();
}
