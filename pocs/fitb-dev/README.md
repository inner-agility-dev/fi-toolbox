
# fitb CLI (Oclif + Knex)

## Commands

- `fitb task list`
- `fitb task get --id 1`
- `fitb task create --data '{ "title": "Test", "description": "desc", "status": "open" }'`
- `fitb task update --id 1 --data '{ "status": "closed" }'`
- `fitb task delete --id 1`

Make sure to update `.env` with your Postgres credentials.
