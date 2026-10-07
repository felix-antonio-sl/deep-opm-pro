import {expect,test} from 'bun:test';
import {puertoE2e} from './configuracion';
test('WP-17 puerto explícito normalizado, default y límites',()=>{expect(puertoE2e(undefined)).toBe(8787);expect(puertoE2e('18877')).toBe(18877);expect(puertoE2e('0018877')).toBe(18877);expect(puertoE2e('1')).toBe(1);expect(puertoE2e('65535')).toBe(65535);for(const x of ['','0','65536','1.5','-1','18877; touch fichero',' 18877','1e3','Infinity','999999999999999999999'])expect(()=>puertoE2e(x)).toThrow();});
